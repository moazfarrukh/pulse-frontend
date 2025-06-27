// Text formatting utilities for chat messages

export interface FormattedTextSegment {
  text: string;
  type: 'bold' | 'italic' | 'normal';
}



export const parseFormattedText = (text: string): FormattedTextSegment[] => {
  // Pattern to match both bold (**text**) and italic (*text*) with proper boundaries
  const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  const segments: FormattedTextSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add any normal text before this match
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        type: 'normal'
      });
    }

    // Determine if it's bold or italic
    if (match[1]) {
      // Bold match
      segments.push({
        text: match[2],
        type: 'bold'
      });
    } else {
      // Italic   
      segments.push({
        text: match[4],
        type: 'italic'
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      type: 'normal'
    });
  }

  return segments.length > 0 ? segments : [{ text, type: 'normal' }];
};

export const renderFormattedText = (text: string) => {
  const segments = parseFormattedText(text);
  
  return (
    <>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'bold':
            return <strong key={index}>{segment.text}</strong>;
          case 'italic':
            return <em key={index}>{segment.text}</em>;
          default:
            return <span key={index}>{segment.text}</span>;
        }
      })}
    </>
  );
}; 