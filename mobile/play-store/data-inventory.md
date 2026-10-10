# Data inventory for release review

This documents observed implementation, not preselected Play Console answers. Recheck the final binary, deployed backend, service policies and actual Console definitions before submission.

| Data / action | Destination and purpose | Release considerations |
|---|---|---|
| Protein sequences, selected taxonomy and BLAST options | After explicit consent, configured Netlify backend and NCBI for sequence search | Optional user-initiated online analysis. Treat actual transmitted content according to Console definitions; sequences may contain research-sensitive data. |
| BLAST jobs, results, linked records and request identifiers | Backend Netlify Blobs cache; NCBI service records | Seven-day cache reuse window, not automatic deletion. Backend deletion requests use developer contact and RID. NCBI retention is outside app control. |
| IP addresses / request metadata | Network providers, Netlify and NCBI during service use | Verify provider logging/retention and Console collection/sharing definitions. Do not claim no remote data collection. |
| Quiz/progress/bookmarks/notes | App-local WebView storage | No app backend upload in this release; local clear/uninstall. |
| Typed local directory names/emails/phone/institution | App-local storage, user-initiated CSV sharing | Not device contacts; no phone contacts permission. No subscription/account creation in Android v0.1.0. |
| FASTA file chosen by user | Android file picker → app memory; selected sequence sent only on consent | No broad storage permission. |
| Exported reports | App cache → Android share chooser → destination chosen by user | Destination receives selected content. Cached exports can be cleared; saved external copies remain. |
| External links | Browser/email/dial apps | External services have their own policies. ACTION_DIAL does not place a call. |

Expected standard permissions: INTERNET and ACCESS_NETWORK_STATE. AndroidX also adds the app-scoped signature permission `com.arifuddin.biohub.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` for internal broadcast protection; it is not personal-data or device-sensor access. FileProvider exposes only `cache/exports/` with temporary URI grants. Camera, microphone, location, contacts, broad storage, advertising-ID access and payment SDKs are absent. No ads or analytics SDK is added. Android backup is disabled for this release. Verify the merged manifest rather than relying only on source.

Android release has guest access only, without online user account creation. If online accounts are introduced later, implement the required account/deletion flows and update this inventory and policies. User-local contact storage is not an online account.

Proposed public policy URL: https://capable-fairy-dd36f0.netlify.app/privacy-policy.html — source supplied, deployment must be verified before use in Console.
