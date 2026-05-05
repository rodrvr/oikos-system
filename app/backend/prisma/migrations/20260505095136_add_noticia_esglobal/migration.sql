-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "es_global" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "iglesia_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_iglesia_id_fkey" FOREIGN KEY ("iglesia_id") REFERENCES "Iglesia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
