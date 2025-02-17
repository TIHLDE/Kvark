import { boolean } from "zod"
import CountDown from './CountDown';
import { de } from "date-fns/locale";

interface PaymentStatusProps {
    hasPaid: boolean;
    expireDate: Date;
}

const PaymentStatus = ({hasPaid, expireDate}:PaymentStatusProps) => {
    if (hasPaid) {
        return (
            <div className="text-green-700">
                <p>Betaling godkjent.</p>
            </div>
        )
    }
    return (
        <div>
            <CountDown expiredate={expireDate}/>
        </div>
    )
}

export default PaymentStatus;