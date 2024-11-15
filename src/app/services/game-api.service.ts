import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

const _BASE_URL = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class GameApiService {
  constructor(private http: HttpClient) {}

  async login(usuario: string, password: string): Promise<any> {
    const response = await lastValueFrom(
      this.http.post<{ message: string; token: string }>(
        `${_BASE_URL}/login`,
        { usuario, password }
      )
    );
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(correo: string, usuario: string, password: string): Promise<any> {
    return await this.http
      .post(`${_BASE_URL}/register`, { correo, usuario, password })
      .toPromise();
  }
  

  async start(): Promise<any> {
    return await this.http.post(`${_BASE_URL}/start`, {}).toPromise();
  }
  
  async guess(numero: number): Promise<any> {
    return await this.http.post(`${_BASE_URL}/guess`, { numero }).toPromise();
  }
  

  async restart(): Promise<any> {
    return await this.http.post(`${_BASE_URL}/restart`, {}).toPromise();
  }
  

  async status(): Promise<any> {
    return await this.http.get(`${_BASE_URL}/status`, {}).toPromise();
  }
  

  async leaderboard(): Promise<any> {
    return await this.http.get(`${_BASE_URL}/leaderboard`).toPromise();
  }

  async statistics(): Promise<any> {
    return await this.http.get(`${_BASE_URL}/statistics`, {}).toPromise();
  }
  
}


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - usuario
 *         - password
 *       properties:
 *         usuario:
 *           type: string
 *           description: Nombre de usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         correo:
 *           type: string
 *           description: Correo electrónico del usuario
 *     GuessNumber:
 *       type: object
 *       required:
 *         - numero
 *       properties:
 *         numero:
 *           type: integer
 *           description: Número que el usuario intenta adivinar
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Registro exitoso
 */

/**
 * @swagger
 * /start:
 *   post:
 *     summary: Iniciar nuevo juego
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Juego iniciado exitosamente
 */

/**
 * @swagger
 * /guess:
 *   post:
 *     summary: Intentar adivinar el número
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuessNumber'
 *     responses:
 *       200:
 *         description: Resultado del intento
 */

/**
 * @swagger
 * /restart:
 *   post:
 *     summary: Reiniciar juego actual
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Juego reiniciado exitosamente
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Obtener estado del juego actual
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado del juego actual
 */

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Obtener tabla de posiciones
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jugadores y sus puntajes
 */

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Obtener estadísticas del jugador
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del jugador actual
 */


