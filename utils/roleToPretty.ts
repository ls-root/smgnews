export default function roleToPretty(role: string) {
  return role.startsWith("klasse_") ? role.replace("klasse_", "Klasse ") : role
}
