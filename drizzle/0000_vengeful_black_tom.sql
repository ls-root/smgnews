CREATE TABLE "anonymousUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"anon_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"answer" varchar(256),
	"votes" integer DEFAULT 0,
	"question_id" integer
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text
);
--> statement-breakpoint
CREATE TABLE "stars" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"stars" integer,
	"anonymous_user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "anonIdUniqueIndex" ON "anonymousUsers" USING btree ("anon_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stars_user_post_unique" ON "stars" USING btree ("anonymous_user_id","post_id");