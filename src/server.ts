import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { getLocationFromIP } from './utils.js';

const dbUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./dev.db';
const adapterConfig = {
    url: dbUrl,
    ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {})
};
const adapter = new PrismaLibSql(adapterConfig);
const prisma = new PrismaClient({ adapter });

const server = Fastify({ logger: true });

// Setup CORS - allows frontend on any domain to contact this API
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST']
});

interface TrackBody {
    url: string;
    title?: string;
    referrer?: string;
    userAgent?: string;
}

server.post('/track', async (request, reply) => {
    const body = request.body as TrackBody | undefined;

    if (!body || !body.url) {
        return reply.status(400).send({ error: "URL is required in JSON body" });
    }

    const { url, title, referrer, userAgent: bodyUserAgent } = body;

    // Get IP correctly from proxies
    const ipHeader = request.headers['x-forwarded-for'];
    const ip = Array.isArray(ipHeader) ? ipHeader[0] : (ipHeader || request.ip);

    const userAgent = bodyUserAgent || request.headers['user-agent'] || 'Desconhecido';

    let location = null;
    if (typeof ip === 'string') {
        location = await getLocationFromIP(ip.split(',')[0].trim());
    }

    try {
        // Upsert Link - Keep track of total clicks safely
        const link = await prisma.link.upsert({
            where: { url },
            update: {
                clicks: { increment: 1 },
                title: title || undefined
            },
            create: {
                url,
                title: title || url,
                clicks: 1
            }
        });

        // Register the specific click event
        await prisma.clickEvent.create({
            data: {
                linkId: link.id,
                ipAddress: typeof ip === 'string' ? ip : null,
                userAgent,
                country: location?.country,
                city: location?.city,
                region: location?.region,
                referrer
            }
        });

        return reply.status(200).send({ success: true });
    } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
});

server.get('/stats', async (request, reply) => {
    const links = await prisma.link.findMany({
        orderBy: { clicks: 'desc' },
        include: {
            _count: {
                select: { events: true }
            }
        }
    });

    return reply.status(200).send(links);
});

server.get('/', async (request, reply) => {
    return reply.status(200).send({ message: "Links Tracker API is running!" });
});

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Servidor rodando em http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
