-- Create table for coupons/discount codes
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  applicable_to TEXT DEFAULT 'all' CHECK (applicable_to IN ('all', 'specific_products', 'specific_categories')),
  applicable_products TEXT[],
  applicable_categories TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);

-- Create table to track coupon usage by users
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id TEXT,
  order_id TEXT,
  discount_applied DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_dates ON coupons(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);

-- Create function to validate and apply coupon
CREATE OR REPLACE FUNCTION validate_coupon(
  p_code TEXT,
  p_cart_total DECIMAL,
  p_user_id TEXT DEFAULT NULL,
  p_product_ids TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS TABLE (
  valid BOOLEAN,
  discount_amount DECIMAL,
  error_message TEXT,
  coupon_id UUID
) AS $$
DECLARE
  v_coupon RECORD;
  v_usage_count INTEGER;
  v_calculated_discount DECIMAL;
BEGIN
  -- Get coupon details
  SELECT * INTO v_coupon
  FROM coupons
  WHERE code = p_code AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW());

  -- Check if coupon exists and is valid
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Cupón inválido o expirado'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Check minimum purchase amount
  IF p_cart_total < v_coupon.min_purchase_amount THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 
      format('Compra mínima requerida: $%s', v_coupon.min_purchase_amount),
      NULL::UUID;
    RETURN;
  END IF;

  -- Check usage limit
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Cupón agotado'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Check per-user limit
  IF p_user_id IS NOT NULL AND v_coupon.per_user_limit IS NOT NULL THEN
    SELECT COUNT(*) INTO v_usage_count
    FROM coupon_usage
    WHERE coupon_id = v_coupon.id AND user_id = p_user_id;

    IF v_usage_count >= v_coupon.per_user_limit THEN
      RETURN QUERY SELECT false, 0::DECIMAL, 'Ya usaste este cupón'::TEXT, NULL::UUID;
      RETURN;
    END IF;
  END IF;

  -- Check product/category applicability
  IF v_coupon.applicable_to = 'specific_products' THEN
    IF NOT (v_coupon.applicable_products && p_product_ids) THEN
      RETURN QUERY SELECT false, 0::DECIMAL, 'Cupón no aplicable a estos productos'::TEXT, NULL::UUID;
      RETURN;
    END IF;
  END IF;

  -- Calculate discount
  IF v_coupon.discount_type = 'percentage' THEN
    v_calculated_discount := p_cart_total * (v_coupon.discount_value / 100);
    IF v_coupon.max_discount_amount IS NOT NULL THEN
      v_calculated_discount := LEAST(v_calculated_discount, v_coupon.max_discount_amount);
    END IF;
  ELSIF v_coupon.discount_type = 'fixed' THEN
    v_calculated_discount := v_coupon.discount_value;
  ELSIF v_coupon.discount_type = 'free_shipping' THEN
    v_calculated_discount := 0; -- Will be handled separately
  END IF;

  -- Ensure discount doesn't exceed cart total
  v_calculated_discount := LEAST(v_calculated_discount, p_cart_total);

  RETURN QUERY SELECT true, v_calculated_discount, NULL::TEXT, v_coupon.id;
END;
$$ LANGUAGE plpgsql;

-- Insert some example coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit, valid_until)
VALUES 
  ('BIENVENIDO10', 'Descuento de bienvenida del 10%', 'percentage', 10, 50, NULL, NOW() + INTERVAL '90 days'),
  ('ENVIOGRATIS', 'Envío gratis en compras mayores a $300', 'free_shipping', 0, 300, NULL, NOW() + INTERVAL '30 days'),
  ('PRIMERACOMPRA', 'Descuento de $50 en tu primera compra', 'fixed', 50, 200, 100, NOW() + INTERVAL '60 days')
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE coupons IS 'Discount coupons and promotional codes';
COMMENT ON TABLE coupon_usage IS 'Track coupon usage by users';
