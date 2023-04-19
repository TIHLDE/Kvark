import { User } from "types/User";
import { Event } from "types/Event";

export type Order = {
    access: string[],
    order_id: string,
    user_id: User["user_id"],
    event_id: Event["id"],
    status: string,
    expire_date: Date,
    payment_link: string
}