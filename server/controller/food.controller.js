import { pool } from '../db.js';
import fs from "fs/promises";
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

// controlador para obtener una comida 
export const getFood = async (req, res) => {
    try {
        const id = req.params.id;
        const [date] = await pool.query("SELECT * FROM foods WHERE id = ?", [id]);
        
        if (date.length === 0) {
            return res.status(404).json({ message: "la comida no fue encontrada" });
        }
        return res.status(200).json(date[0]);

    } catch (error) {
        return res.status(500).json({ error: "Hubo un error al guardar el alimento: " + error.message });
    }
};

// controlador para obtener todas las comidas 
export const getFoods = async (req, res) => { 
    const [dates] = await pool.query("SELECT * FROM foods");
    res.status(200).json(dates);
};

// controlador para guardar una comida
export const createFood = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const image = req.file["filename"];

        const [dates] = await pool.query("INSERT INTO foods(title, description, photo, type) VALUES(?, ?, ?, ?)", [title, description, image, type]);
        res.status(201).json({ message: "plato guardado exitosamente" });

    } catch (error) {
        return res.status(500).json({ error: "Hubo un error al guardar el alimento: " + error.message });
    }
};

// controlador para editar algo de la comida
export const editFood = async (req, res) => {
    let newImage = null;

    try {
        if (req.file) {
            newImage = join(CURRENT_DIR, "../public/uploads", req.file["filename"]);
        }
        const id = req.params.id; 

        const [existFood] = await pool.query("SELECT * FROM foods WHERE id = ?", [id]);

        if (existFood.length === 0) {
            if (newImage) {
                try {
                    await fs.unlink(newImage);
                } catch (error) {
                    console.log("error al borrar la imagen: " + error);
                }
            }

            return res.status(404).json({ message: "la comida no fue encontrada" });
        }

        const existFooDatadata = existFood[0];

        const { title, description, type } = req.body;

        if (!title && !description && !req.file) {
            return res.status(400).json({ message: "no se ha enviado ningun dato para editar" });
        }

        const data = { title, description, type };

        if (req.file) {
            data.photo = req.file["filename"];
            const url = join(CURRENT_DIR, "../public/uploads", existFooDatadata.photo);
            await fs.unlink(url);
        } 

        const query = await pool.query("UPDATE foods SET ? WHERE id = ?", [data, id]);
        console.log(data);
        res.status(200).json({
            message: "plato actualizado",
            data: data
        });

    } catch (error) {
        if (newImage) {
            try {
                await fs.unlink(newImage);
            } catch (unlinkError) {
                console.log("error al borrar la imagen huérfana en el catch general: " + unlinkError);
            }
        }

        throw new Error("Hubo un error al actualizar el alimento: " + error.message);
    }
};

// controlador para eliminar una comida 
export const deleteFood = async (req, res) => {
    try {
        const id = req.params.id;

        const [existFood] = await pool.query("SELECT * FROM foods WHERE id = ?", [id]);

        if (existFood.length === 0) {
            return res.status(404).json({ message: "la comida no fue encontrada" });
        }
        
        const [result] = await pool.query("DELETE FROM foods WHERE id = ?", [id]); 

        const existFoodData = existFood[0];

        if (existFoodData.photo) {
            const url = join(CURRENT_DIR, "../public/uploads", existFoodData.photo);
            await fs.unlink(url);
        }
        return res.status(200).json({ message: "la comida a sido eliminada" });

    } catch (error) {
        return res.status(500).json({ error: "Hubo un error al eliminar el alimento: " + error.message });        
    }
};