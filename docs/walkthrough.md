# Example walkthrough

Open https://paramwise.vercel.app/ and choose **Try example**, then **Clean links** with deduplication enabled.

The receipt shows:
- 3 links in the export
- 2 known parameters removed
- 1 protected link
- 1 duplicate excluded
- 1 invalid input excluded

[cleaned-links.txt](../examples/cleaned-links.txt) contains the expected TXT download. The protected link deliberately retains its UTM parameter because changing a signed URL could invalidate it. Example signatures are placeholders, not real credentials.

Editing the pasted input or changing deduplication hides the previous result, so exports cannot silently use stale output. Run Clean links again to export the new batch.
