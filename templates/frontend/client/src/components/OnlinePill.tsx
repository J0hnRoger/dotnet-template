import { motion } from 'framer-motion';
import React from 'react';

interface OnlinePillProps {
    isOnline: boolean;
}

export const OnlinePill: React.FC<OnlinePillProps> = ({ isOnline }) => {
    if (!isOnline) return null;
    const pulse = {
        scale: [1, 1.2, 1.2, 1],
        transition: {
            duration: 1,
            repeat: Infinity
        }
    }
    return (
        <motion.div animate={pulse} className="flex h-3 w-3">
            <div className="inline-flex h-full w-full rounded-full bg-green-400">
            </div>
        </motion.div>
    );
};
