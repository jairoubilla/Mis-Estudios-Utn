import { pool } from "../db.js";

export const listartareas = async (req, res) => {
    console.log(req.usuarioId);
    const resultado = await pool.query("SELECT * FROM tareas WHERE usuario_id = $1", [req.usuarioId]);
    return res.json(resultado.rows);
}

export const listartarea = async (req, res) => {
    const resultado = await pool.query("SELECT * FROM tareas WHERE id = $1", [req.params.id]);
    if (resultado.rowCount === 0) {
        return res.status(404).json({
            message: "Tarea no encontrada"
        });
    }
    return res.json(resultado.rows[0]);
}

export const creartarea = async (req, res, next) => {
    const { titulo, descripcion } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO tareas (titulo, descripcion, usuario_id) VALUES ($1, $2, $3) RETURNING *",
            [titulo, descripcion, req.usuarioId],
        );
        res.json(result.rows[0]);
        console.log(result.rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.send("ya existe una tarea con ese titulo");
        }
        console.log(error);
        next(error);
    }
};

export const actualizartarea = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const id = req.params.id;
    const resultado = await pool.query(
        "UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *",[titulo, descripcion, id]
    );
    if (resultado.rowCount === 0) {
        return res.status(404).json({
            message: "No existe una tarea con ese ID"
        });
    }
    return res.json(resultado.rows[0]);
}

export const eliminartarea = async (req, res) => {
    const resultado = await pool.query("DELETE FROM tareas WHERE id = $1", [req.params.id]);
    if (resultado.rowCount === 0) {
        return res.status(404).json({
            message: "No existe una tarea con ese ID"
        });
    }
    return res.sendStatus(204);
}
