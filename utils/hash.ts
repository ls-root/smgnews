import bcrypt from "bcryptjs"
import { base64url } from "jose"

const password = "123"
const hash = bcrypt.hashSync(password, 10)
const encoded = base64url.encode(hash)

console.log("Raw hash:", hash)
console.log("Encoded for .env:", encoded)
