import NextCors from 'nextjs-cors';
import excuteQuery from 'src/lib/db';

export default async (req, res) => {
    const { method } = req;
    let responseCode = 200;
    let responseMessage = null;

    // Run the cors middleware
    // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    switch (method) {
        case "GET":
            try {
                const result = await excuteQuery({ query: 'SELECT * FROM content' });

                return res.status(responseCode).send({
                    status: {
                        code: responseCode,
                        message: responseMessage,
                        data: result
                    }
                });
            } catch (error) {
                return res.status(400).send({
                    status: {
                        code: responseCode,
                        message: responseMessage,
                        data: error
                    }
                });
            }
        case "POST":
            try {
                const { title, platform, text, category, publish_date, images, status, created_date } = req.body;

                if (!title) {
                    responseCode = 400;
                    responseMessage = "Title is Required";
                } else if (!platform) {
                    responseCode = 400;
                    responseMessage = "Platform is Required";
                } else if (!text) {
                    responseCode = 400;
                    responseMessage = "Text is Required";
                } else if (!category) {
                    responseCode = 400;
                    responseMessage = "Category is Required";
                } else if (!publish_date) {
                    responseCode = 400;
                    responseMessage = "Publish Date is Required";
                }

                let result = null;
                if (responseCode === 200) {
                    result = await excuteQuery({
                        query: 'INSERT INTO content (title, platform, text, category, publish_date, status, created_date, images) VALUES (?,?,?,?,?,?,?,?)',
                        values: [title, platform, text, category, publish_date, status, created_date, images]
                    });

                    responseMessage = 'Content created successfully';
                }

                /* Response */
                return res.status(responseCode).send({
                    status: {
                        code: responseCode,
                        message: responseMessage,
                        data: result
                    }
                });
            } catch (error) {
                return res.status(400).send({
                    status: {
                        code: responseCode,
                        message: responseMessage,
                        data: error
                    }
                });
            }
        default:
            res.setHeaders("Allow", ["GET", "POST"]);
            return res
                .status(405)
                .json({ success: false })
                .end(`Method ${method} Not Allowed`);
    }
};