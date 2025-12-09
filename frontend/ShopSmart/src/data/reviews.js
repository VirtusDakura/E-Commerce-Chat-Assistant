// Mock customer reviews for products
export const reviews = {
    p1: [
        {
            id: "r1",
            productId: "p1",
            userName: "Kwame Mensah",
            rating: 5,
            date: "2024-11-15",
            title: "Best headphones I've ever owned!",
            comment: "The noise cancellation is incredible. I use these daily for work and the battery lasts all week. Sound quality is exceptional.",
            helpful: 24
        },
        {
            id: "r2",
            productId: "p1",
            userName: "Ama Osei",
            rating: 5,
            date: "2024-11-10",
            title: "Worth every penny",
            comment: "Crystal clear audio and very comfortable for long listening sessions. The build quality feels premium.",
            helpful: 18
        },
        {
            id: "r3",
            productId: "p1",
            userName: "Kofi Asante",
            rating: 4,
            date: "2024-11-05",
            title: "Great but pricey",
            comment: "Excellent sound quality and noise cancellation. Only downside is the price, but you get what you pay for.",
            helpful: 12
        }
    ],
    p2: [
        {
            id: "r4",
            productId: "p2",
            userName: "Abena Owusu",
            rating: 5,
            date: "2024-11-20",
            title: "Perfect fitness companion",
            comment: "Tracks everything I need - steps, heart rate, sleep. Battery life is amazing and it looks great!",
            helpful: 31
        },
        {
            id: "r5",
            productId: "p2",
            userName: "Yaw Boateng",
            rating: 4,
            date: "2024-11-12",
            title: "Good smartwatch",
            comment: "Does everything it promises. GPS is accurate and notifications work perfectly. Wish it had more watch faces.",
            helpful: 15
        }
    ],
    p3: [
        {
            id: "r6",
            productId: "p3",
            userName: "Efua Adjei",
            rating: 5,
            date: "2024-11-18",
            title: "Amazing sound for the size!",
            comment: "This little speaker packs a punch! Took it to the beach and it survived sand and water. Highly recommend.",
            helpful: 28
        },
        {
            id: "r7",
            productId: "p3",
            userName: "Kwabena Frimpong",
            rating: 4,
            date: "2024-11-08",
            title: "Great portable speaker",
            comment: "Sound quality is impressive. Battery lasts long. Only wish it was a bit louder for outdoor parties.",
            helpful: 19
        }
    ],
    p4: [
        {
            id: "r8",
            productId: "p4",
            userName: "Akosua Darko",
            rating: 5,
            date: "2024-11-22",
            title: "So comfortable!",
            comment: "The fabric is incredibly soft and breathable. Fits perfectly and the quality is top-notch.",
            helpful: 42
        },
        {
            id: "r9",
            productId: "p4",
            userName: "Nana Appiah",
            rating: 5,
            date: "2024-11-14",
            title: "Best t-shirt ever",
            comment: "I bought 5 of these in different colors. They wash well and don't shrink. Highly recommend!",
            helpful: 35
        }
    ],
    p6: [
        {
            id: "r10",
            productId: "p6",
            userName: "Adjoa Mensah",
            rating: 5,
            date: "2024-11-25",
            title: "Perfect for running!",
            comment: "These shoes are incredibly lightweight and comfortable. My running times have improved since switching to these.",
            helpful: 56
        },
        {
            id: "r11",
            productId: "p6",
            userName: "Kojo Agyeman",
            rating: 5,
            date: "2024-11-19",
            title: "Best running shoes",
            comment: "Great cushioning and support. My feet don't hurt after long runs anymore. Worth the investment!",
            helpful: 48
        },
        {
            id: "r12",
            productId: "p6",
            userName: "Esi Ankrah",
            rating: 4,
            date: "2024-11-11",
            title: "Very good shoes",
            comment: "Comfortable and breathable. Only issue is they run slightly small, so order half a size up.",
            helpful: 33
        }
    ]
};

export const getReviewsForProduct = (productId) => {
    return reviews[productId] || [];
};

export const getAverageRating = (productId) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
};
