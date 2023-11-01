-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "judul" TEXT,
    "deskripsi" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Posts_userId_key" ON "Posts"("userId");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
