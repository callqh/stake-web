import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useWriteContract as useWagmiWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

/**
 *
 */
export const useWriteContract = ({
  successCallback,
}: {
  successCallback?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const { writeContract, data: hash } = useWagmiWriteContract({
    mutation: {
      onMutate: () => {
        setLoading(true);
      },
      onSettled: (data, error) => {
        if (error) {
          toast.error(error.message);
          setLoading(false);
        }
        return data || error;
      },
    },
  });

  const receipt = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
      refetchIntervalInBackground: false,
    },
  });

  useEffect(() => {
    toast.dismiss();
    switch (receipt.status) {
      case 'success': {
        toast.success('Success!', {
          description: receipt.data.blockHash,
        });
        successCallback?.();
        setLoading(false);
        break;
      }
      case 'error': {
        toast.error('Error!', {
          description: receipt.error?.message,
        });
        setLoading(false);
        break;
      }
    }
  }, [receipt]);

  return { writeContract, receipt, loading };
};
