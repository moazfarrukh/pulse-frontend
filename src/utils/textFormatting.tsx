// Text formatting utilities for chat messages

import React from 'react';

export interface FormattedTextSegment {
  text: string;
  type: 'bold' | 'italic' | 'code' | 'link' | 'list' | 'normal';
  url?: string; // For link segments
}

export const parseFormattedText = (text: string): FormattedTextSegment[] => {
  // Pattern to match bold (**text**), italic (*text*), code (`text`), links [text](url), and lists (- text or * text)
  // Code blocks should be matched first to avoid conflicts with other formatting
  const codePattern = /(`([^`]+)`)/g;
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldItalicPattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  
  const segments: FormattedTextSegment[] = [];
  let lastIndex = 0;
  let match;

  // First, find all code blocks
  const codeMatches: Array<{start: number, end: number, text: string}> = [];
  while ((match = codePattern.exec(text)) !== null) {
    codeMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[2]
    });
  }

  // Find all link blocks
  const linkMatches: Array<{start: number, end: number, text: string, url: string}> = [];
  while ((match = linkPattern.exec(text)) !== null) {
    linkMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      url: match[2]
    });
  }

  // Check if the entire text is a list
  const isEntireTextList = /^(\s*[-*]\s+.+\n?)+$/.test(text);
  
  if (isEntireTextList) {
    // Handle list formatting
    const lines = text.split('\n');
    const listItems = lines.filter(line => line.trim() && /^\s*[-*]\s+/.test(line));
    
    if (listItems.length > 0) {
      listItems.forEach((item, index) => {
        const cleanText = item.replace(/^\s*[-*]\s+/, '').trim();
        if (cleanText) {
          segments.push({
            text: cleanText,
            type: 'list'
          });
          // Add line break between list items (except for the last one)
          if (index < listItems.length - 1) {
            segments.push({
              text: '\n',
              type: 'normal'
            });
          }
        }
      });
      return segments;
    }
  }

  // Then process the text, handling code and link blocks specially
  let currentIndex = 0;
  let codeMatchIndex = 0;
  let linkMatchIndex = 0;

  while (currentIndex < text.length) {
    // Check if we're at a code block
    if (codeMatchIndex < codeMatches.length && currentIndex === codeMatches[codeMatchIndex].start) {
      // Add any normal text before this code block
      if (currentIndex > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, currentIndex),
          type: 'normal'
        });
      }

      // Add the code segment
      segments.push({
        text: codeMatches[codeMatchIndex].text,
        type: 'code'
      });

      lastIndex = codeMatches[codeMatchIndex].end;
      currentIndex = lastIndex;
      codeMatchIndex++;
      continue;
    }

    // Check if we're at a link block
    if (linkMatchIndex < linkMatches.length && currentIndex === linkMatches[linkMatchIndex].start) {
      // Add any normal text before this link block
      if (currentIndex > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, currentIndex),
          type: 'normal'
        });
      }

      // Add the link segment
      segments.push({
        text: linkMatches[linkMatchIndex].text,
        type: 'link',
        url: linkMatches[linkMatchIndex].url
      });

      lastIndex = linkMatches[linkMatchIndex].end;
      currentIndex = lastIndex;
      linkMatchIndex++;
      continue;
    }

    // If we're inside a code block, skip to the end
    if (codeMatchIndex < codeMatches.length && 
        currentIndex > codeMatches[codeMatchIndex].start && 
        currentIndex < codeMatches[codeMatchIndex].end) {
      currentIndex = codeMatches[codeMatchIndex].end;
      lastIndex = currentIndex;
      codeMatchIndex++;
      continue;
    }

    // If we're inside a link block, skip to the end
    if (linkMatchIndex < linkMatches.length && 
        currentIndex > linkMatches[linkMatchIndex].start && 
        currentIndex < linkMatches[linkMatchIndex].end) {
      currentIndex = linkMatches[linkMatchIndex].end;
      lastIndex = currentIndex;
      linkMatchIndex++;
      continue;
    }

    // Process bold and italic for non-code, non-link text
    const remainingText = text.substring(currentIndex);
    const boldItalicMatch = boldItalicPattern.exec(remainingText);
    
    if (boldItalicMatch) {
      const matchStart = currentIndex + boldItalicMatch.index;
      const matchEnd = matchStart + boldItalicMatch[0].length;

      // Check if this match overlaps with a code block or link block
      const overlapsWithCode = codeMatches.some(codeMatch => 
        (matchStart >= codeMatch.start && matchStart < codeMatch.end) ||
        (matchEnd > codeMatch.start && matchEnd <= codeMatch.end) ||
        (matchStart <= codeMatch.start && matchEnd >= codeMatch.end)
      );

      const overlapsWithLink = linkMatches.some(linkMatch => 
        (matchStart >= linkMatch.start && matchStart < linkMatch.end) ||
        (matchEnd > linkMatch.start && matchEnd <= linkMatch.end) ||
        (matchStart <= linkMatch.start && matchEnd >= linkMatch.end)
      );

      if (overlapsWithCode || overlapsWithLink) {
        currentIndex++;
        continue;
      }

      // Add any normal text before this match
      if (matchStart > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, matchStart),
          type: 'normal'
        });
      }

      // Determine if it's bold or italic
      if (boldItalicMatch[1]) {
        // Bold match
        segments.push({
          text: boldItalicMatch[2],
          type: 'bold'
        });
      } else {
        // Italic match
        segments.push({
          text: boldItalicMatch[4],
          type: 'italic'
        });
      }

      lastIndex = matchEnd;
      currentIndex = matchEnd;
    } else {
      currentIndex++;
    }
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
          case 'code':
            return <code key={index} className="inline-code">{segment.text}</code>;
          case 'link':
            return (
              <a 
                key={index} 
                href={segment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="formatted-link"
              >
                {segment.text}
              </a>
            );
          case 'list':
            return <span key={index} className="list-item">{segment.text}</span>;
          default:
            // Split normal text by newlines and insert <br />
            const lines = segment.text.split(/\n/g);
            return lines.map((line, i) => (
              <React.Fragment key={`${index}-${i}`}>
                {line}
                {i < lines.length - 1 && <br />}
              </React.Fragment>
            ));
        }
      })}
    </>
  );
};

// Helper function to detect if text is a list
export const isListText = (text: string): boolean => {
  return /^(\s*)([-*]\s+)(.+)$/gm.test(text);
};

// Helper function to detect if text is a link
export const isLinkText = (text: string): boolean => {
  return /^\[([^\]]+)\]\(([^)]+)\)$/.test(text);
};

// Test function to verify formatting works correctly
export const testFormatting = () => {
  const testCases = [
    "This is **bold** text",
    "This is *italic* text", 
    "This is `code` text",
    "This is [a link](https://example.com) text",
    "This is a list:\n- Item 1\n- Item 2",
    "This is **bold** and *italic* and `code` and [link](https://example.com) text"
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase}"`);
    const segments = parseFormattedText(testCase);
    console.log('Segments:', segments);
    console.log('---');
  });
}; 