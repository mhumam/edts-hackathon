
import excuteQuery from 'src/lib/db';

export default async (req, res) => {
    const { method, query: { id }, body: requestBody } = req;
    let responseCode = 200;
    let responseMessage = null;

    switch (method) {
        case "GET":
            try {
                const result = await excuteQuery({ query: 'SELECT * FROM content WHERE id = ?', values: [id] });
                return res.status(responseCode).send({
                    status: {
                        code: responseCode,
                        message: responseMessage,
                        data: result?.[0]
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
        case "PUT":
            try {
                const result = await excuteQuery({ query: 'UPDATE content SET status = ? WHERE id = ? ', values: [requestBody?.status, id] });
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
            res.setHeaders("Allow", ["GET", "PUT"]);
            return res
                .status(405)
                .json({ success: false })
                .end(`Method ${method} Not Allowed`);
    }
};