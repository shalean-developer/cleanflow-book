import { supabase } from '@/integrations/supabase/client';

export interface PromoClaim {
  code: string;
  serviceSlug: string;
  sessionId: string;
  email?: string;
  expiresAt: string;
}

export interface PromoResult {
  success: boolean;
  claim?: any;
  message: string;
  error?: string;
}

/**
 * Direct database approach to claim promo codes, bypassing Edge Function CORS issues
 */
export async function claimPromoDirect(claimData: PromoClaim): Promise<PromoResult> {
  try {
    console.log('🎯 Claiming promo directly via database:', claimData);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        message: 'Authentication required to claim promo codes',
        error: 'User not authenticated'
      };
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Check for existing active claim for this session/code
    const { data: existingClaims, error: existingError } = await supabase
      .from('promo_claims')
      .select('*')
      .eq('code', claimData.code)
      .eq('session_id', claimData.sessionId)
      .eq('status', 'claimed')
      .maybeSingle();
    
    if (existingError) {
      console.error('❌ Error checking existing claims:', existingError);
      return {
        success: false,
        message: 'Failed to check existing claims',
        error: existingError.message
      };
    }
    
    if (existingClaims) {
      console.log('ℹ️ Promo already claimed for this session');
      return {
        success: true,
        claim: existingClaims,
        message: 'Promo already claimed'
      };
    }
    
    // Create new claim
    const { data: newClaim, error: insertError } = await supabase
      .from('promo_claims')
      .insert({
        code: claimData.code,
        user_id: user.id,
        email: claimData.email || user.email,
        service_slug: claimData.serviceSlug,
        applies_to: claimData.serviceSlug,
        session_id: claimData.sessionId,
        expires_at: claimData.expiresAt,
        status: 'claimed',
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error inserting claim:', insertError);
      return {
        success: false,
        message: 'Failed to claim promo',
        error: insertError.message
      };
    }
    
    console.log('✅ Promo claimed successfully:', newClaim);
    
    return {
      success: true,
      claim: newClaim,
      message: 'Promo applied successfully'
    };
    
  } catch (error: any) {
    console.error('❌ Unexpected error claiming promo:', error);
    return {
      success: false,
      message: 'Failed to apply promo. Please try again.',
      error: error.message
    };
  }
}

/**
 * Check if a promo code is valid and available
 */
export async function validatePromoCode(code: string, serviceSlug: string): Promise<{
  valid: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Check if promo code exists in the system
    const { data: promo, error } = await supabase
      .from('promos')
      .select('*')
      .eq('code', code)
      .eq('service_slug', serviceSlug)
      .eq('is_active', true)
      .single();
    
    if (error || !promo) {
      return {
        valid: false,
        message: 'Invalid promo code'
      };
    }
    
    // Check if promo has expired
    if (new Date(promo.expires_at) < new Date()) {
      return {
        valid: false,
        message: 'Promo code has expired'
      };
    }
    
    // Check usage limits
    const { data: claims, error: claimsError } = await supabase
      .from('promo_claims')
      .select('*')
      .eq('code', code)
      .eq('status', 'claimed');
    
    if (claimsError) {
      console.error('Error checking promo usage:', claimsError);
      return {
        valid: false,
        message: 'Unable to validate promo code'
      };
    }
    
    const usageCount = claims?.length || 0;
    
    if (promo.usage_limit && usageCount >= promo.usage_limit) {
      return {
        valid: false,
        message: 'Promo code usage limit reached'
      };
    }
    
    return {
      valid: true,
      message: 'Promo code is valid',
      details: promo
    };
    
  } catch (error: any) {
    console.error('Error validating promo code:', error);
    return {
      valid: false,
      message: 'Failed to validate promo code'
    };
  }
}
