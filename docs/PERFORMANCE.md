# Performance

Areas to monitor and optimize

- Startup time: minimize heavy synchronous initialization in `main()`.
- Memory: large media lists should be paged and use lazy builders.
- Storage: avoid unbounded cache growth; implement LRU for downloaded assets.
- Network: use ranged requests for large media and resume support.

Optimization opportunities

- Use background isolates for compute-heavy parsing (EPUB processing).
- Use efficient binary formats for metadata and manifest files.
