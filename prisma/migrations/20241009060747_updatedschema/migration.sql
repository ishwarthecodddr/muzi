-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "largethumbnail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallthumbnail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
