'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface TwoCheckoutFormProps {
    amount: number;
    onSuccess: (token: string, cardData?: any) => void;
    loading?: boolean;
}

export const TwoCheckoutForm: React.FC<TwoCheckoutFormProps> = ({ amount, onSuccess, loading }) => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Just trigger success with mock data to initiate redirect flow
        onSuccess("hosted_checkout");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    You will be redirected to 2Checkout's secure payment page to complete your purchase.
                </p>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-surface text-primary-blue hover:bg-neutral-100"
                disabled={loading}
            >
                {loading ? 'Processing...' : `Pay $${amount.toFixed(2)} with 2Checkout`}
            </Button>

            <div className="flex justify-center gap-4 mt-4">
                <img src="/icons/visa.svg" alt="Visa" className="h-6 opacity-50" />
                <img src="/icons/mastercard.svg" alt="Mastercard" className="h-6 opacity-50" />
                <img src="/icons/amex.svg" alt="Amex" className="h-6 opacity-50" />
            </div>

            <p className="text-xs text-center text-neutral-gray-light/60">
                Secured by 2Checkout (Verifone)
            </p>
        </form>
    );
};
