import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = new Set(["*"]);
  const allowAllOrigins = allowedOrigins.has("*");

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      // Allow server-to-server or tools that don't send Origin.
      if (
        !origin ||
        allowAllOrigins ||
        allowedOrigins.has(origin) ||
        origin === "null"
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  // ✅ هذا السطر المهم
  await app.listen(port, '0.0.0.0');
}

bootstrap();