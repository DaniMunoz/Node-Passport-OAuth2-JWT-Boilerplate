export default function handler(req, res) {
    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'application/json');
    //res.json({ name: 'John Doe' });
    res.status(200).json({ message: "My first API route" });
}