const sequelizeUsuarioRepository = require('../../infrastructure/repositories/sequelizeUsuarioRepository');

const crearUsuario = require('../../application/useCases/crearUsuario'); 
const obtenerUsuarios = require('../../application/useCases/obtenerUsuarios'); 
const obtenerUsuarioPorId = require('../../application/useCases/obtenerUsuarioPorId');
const actualizarUsuario = require('../../application/useCases/actualizarUsuario'); 
const eliminarUsuario = require('../../application/useCases/eliminarUsuario');


const usuarioRepository = new sequelizeUsuarioRepository(); // Instancia del repositorio de usuario

const UsuarioController = {

    async crearUsuario(req, res) {
            try {
                const nuevoUsuario = await crearUsuario(req.body, usuarioRepository );
               
                res.status(nuevoUsuario.codigo).json(nuevoUsuario.respuesta);
            } catch (error) {
                console.log('error', error);
                res.status(500).json({ error: error.message }); 
            }
        },
    
    async obtenerUsuarios(req, res) {
        try {
            
            const usuarios = await obtenerUsuarios(usuarioRepository); // Llamamos al caso de uso para obtener las usuarios
            res.status(200).json(usuarios.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    
        async obtenerUsuarioPorId(req, res) {
            try {
                const usuario = await obtenerUsuarioPorId(req.params.id, usuarioRepository); // Llamamos al caso de uso para obtener un usuario por ID
                res.status(usuario.codigo).json(usuario.respuesta); // Respondemos con el usuario solicitado
            } catch (error) {
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        },
    
        async actualizarUsuario(req, res) {
            try {
                const usuarioActualizado = await actualizarUsuario(req.params.id, req.body, usuarioRepository); // Llamamos al caso de uso para actualizar un usuario
                
                res.status(usuarioActualizado.codigo).json(usuarioActualizado.respuesta); // Respondemos con el usuario actualizado
            } catch (error) {
                
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        },
    
        async eliminarUsuario(req, res) {
            try {
                const usuarioEliminado = await eliminarUsuario(req.params.id, usuarioRepository); // Llamamos al caso de uso para eliminar un usuario
                res.status(usuarioEliminado.codigo).json(usuarioEliminado.respuesta); // Respondemos con el usuario eliminado
            } catch (error) {
                res.status(500).json({ error: error.message }); // Respondemos con un error
            }
        }

};

module.exports = UsuarioController;