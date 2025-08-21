module.exports = {
    type: "bubble",
    body: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: "これはサンプルの吹き出しメッセージです。",
                wrap: true,
                color: "#000000",
                size: "md",
                margin: "md"
            },
            {
                type: "image",
                url: "https://test-liff-nu.vercel.app/images/sample_fukidashi.png",
                size: "full",
                aspectRatio: "16:9",
                margin: "md"
            }
        ],
        paddingAll: "0px",
        paddingTop: "20px",
        paddingBottom: "0px"
    }
};
