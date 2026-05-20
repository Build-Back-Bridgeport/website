-- CreateTable
CREATE TABLE "petition_signatures" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "signature_data" TEXT,
    "registered_to_vote" BOOLEAN,
    "signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "petition_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "petition_signatures_email_key" ON "petition_signatures"("email");
