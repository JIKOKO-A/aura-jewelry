<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'string|max:3'
        ]);

        $stripeSecret = env('STRIPE_SECRET_KEY');

        if (!$stripeSecret) {
            // Fallback for development if no key is defined yet
            return response()->json([
                'clientSecret' => 'mock_secret_' . bin2hex(random_bytes(16)),
                'message' => 'Stripe key not configured. Running in Mock Mode.'
            ]);
        }

        try {
            Stripe::setApiKey($stripeSecret);

            // Amount in cents (Stripe requirement)
            $amountInCents = round($request->amount * 100);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => strtolower($request->currency ?? 'mad'),
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
