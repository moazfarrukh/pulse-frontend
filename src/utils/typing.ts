
function getTypingText(typingUsers: { user_id: number; display_name: string }[]): string {
  if (typingUsers.length === 0) return "";
  if (typingUsers.length === 1) {
    return `${typingUsers[0].display_name} is typing...`;
  }
  if (typingUsers.length === 2) {
    return `${typingUsers[0].display_name} and ${typingUsers[1].display_name} are typing...`;
  }
  return `${typingUsers
    .slice(0, -1)
    .map((u) => u.display_name)
    .join(", ")} and ${
    typingUsers[typingUsers.length - 1].display_name
  } are typing...`;
}
export { getTypingText };