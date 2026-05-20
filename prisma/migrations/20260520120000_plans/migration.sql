-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_translations" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "markdown" TEXT NOT NULL,

    CONSTRAINT "plan_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "plan_translations_plan_id_lang_key" ON "plan_translations"("plan_id", "lang");

-- AddForeignKey
ALTER TABLE "plan_translations" ADD CONSTRAINT "plan_translations_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
