
import excuteQuery from 'src/lib/db';

export default async (req, res) => {
    const { method } = req;
    let responseCode = 200;
    let responseMessage = null;

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
                const { title, platform, text, category, publish_date, status, created_date } = req.body;

                if (!title) {
                    responseCode = 400;
                    responseMessage = "Title is Required";
                } else if (!platform) {
                    responseCode = 400;
                    responseMessage = "Platform is Required";
                }

                let result = null;
                if (responseCode === 200) {
                    result = await excuteQuery({
                        query: 'INSERT INTO content (title, platform, text, category, publish_date, status, created_date) VALUES (?,?,?,?,?,?,?)',
                        values: [title, platform, text, category, publish_date, status, created_date]
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