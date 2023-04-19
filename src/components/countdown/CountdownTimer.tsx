import styled from "@emotion/styled";
import { Link, Typography } from "@mui/material";
import Paper from "components/layout/Paper";
import vipps from "../../../public/img/vipps.svg";
import React, { useEffect, useState } from "react";

const ContentPaper = styled(Paper)({
    height: 'fit-content',
    overflowX: 'auto'
});

const getTimeDifference = (time: Date) => {
    const now = new Date();
    const myDate = new Date(time);

    return myDate.getTime() - now.getTime();


}

const convertTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes}:${seconds}`;
}

interface Order {
    payment_link: string,
    expire_date: Date
}

const CountdownTimer: React.FC<Order> = ({ payment_link, expire_date }) => {

    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const distance = getTimeDifference(expire_date);
        
            if (distance >= 0) {
                setTimeLeft(convertTime(distance));
            }
            }, 1000);
        
            return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <ContentPaper>
            <Typography
                align='center'
                gutterBottom
                sx={{ color: (theme) => theme.palette.text.primary, fontSize: '2.4rem', wordWrap: 'break-word' }}
                variant='h2'
            >
                Gjenstående tid
            </Typography>
            <Typography
                align="center"
                sx={{ color: (theme) => theme.palette.text.primary, fontSize: '2.4rem', wordWrap: 'break-word' }}
                variant='h2'
            >
                { timeLeft }
            </Typography>
            <Link
                href={payment_link}
            >
                <img 
                    width="40%"
                    src={vipps} 
                    alt="Betaling med vipps" 
                />
            </Link>
        </ContentPaper>
    );
}

export default CountdownTimer;