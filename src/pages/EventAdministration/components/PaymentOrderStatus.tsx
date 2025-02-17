import { CheckCircle, RefreshCcw, Power, AlertTriangle } from "lucide-react";

interface PaymentOrderStatusProps {
    status: string;
}

const PaymentOrderStatus = ({status}:PaymentOrderStatusProps) => {
    if (status === 'SALE'){
        return (
            <div className="flex">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="ml-2">Betalt</p>
            </div>
        )
    }
    if (status === 'INITIATE'){
        return (
            <div className="flex" >
                <RefreshCcw className="w-6 h-6 text-blue-600" />
                <p className="ml-2">Pågående</p>
            </div>
        )
    }
    if (status === 'CANCEL'){
        return (
            <div className="flex">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <p className="ml-2">Avbrutt</p>
            </div>
        )
    }
    return (
        <div>

        </div>
    )


}

export default PaymentOrderStatus;