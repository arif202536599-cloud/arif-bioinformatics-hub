# Arif Bio Hub for Android

A Capacitor 8 Android application that bundles the existing Bioinformatics Hub React interface. App ID: `com.arifuddin.biohub`. Preview version: `0.1.0` (versionCode 1). Android 7+ (minimum API 24), compile/target API 36. There is no hardcoded organism in Central Dogma searches.

## Included

- Learning pathways, tool catalogue, bookmarks, quizzes, local progress, research notes, profile and local research contact directory.
- Protein-to-Central-Dogma Explorer: paste/upload single or multi-FASTA, searchable organism scope, candidates, linked reference evidence, translation checks, synthetic offline demonstration, Excel/FASTA/JSON/SVG/PNG exports.
- Five Android navigation tabs; additional sections remain in the Contents menu. Android Back closes the main drawers and moves through visited tabs.
- Native report sharing, browser database links, email/dial links, network indicator, privacy page and confirmed local-data clearing.
- Guest mode in this Android release. No online account creation, advertising or analytics SDK. The web deployment keeps its existing authentication configuration.

Bundled learning content and deterministic tools work offline. Public database searches, external videos and source links require internet. The separate protein structure example module remains a labelled demonstration; it does not analyse arbitrary protein sequences. Pathway exports on Android are HTML reports shareable to another app; desktop retains its print-to-PDF workflow.

## Current online dependency

The configured backend is `https://capable-fairy-dd36f0.netlify.app/.netlify/functions/central-dogma`. It was returning HTTP 404 during preparation. Source exists in this repository but the site's Netlify Functions deployment must be completed. Do not advertise working live searches or submit the full app for production while that dependency is unavailable. `npm run android:preflight` verifies API health and the public app policy; it intentionally fails while deployment is missing. A green Android build only proves compilation.

For a different developer-controlled deployment, set `VITE_CENTRAL_DOGMA_API` **before building**, then rebuild/sync. This must be HTTPS without URL credentials. Native requests use Capacitor's HTTP API so browser CORS does not require weakening the website's origin checks. The backend retains shared BLAST rate limiting and uncertain-submission safeguards. All Central Dogma scientific limitations, evidence provenance and partial/ambiguous-match labels remain in the app.

## Windows setup and launch

Install Android Studio Otter (2025.2.1) or newer from https://developer.android.com/studio. In SDK Manager install Android SDK Platform 36, Build Tools 36 and Platform Tools, reviewing the SDK licence prompts yourself. Use Java 21 (Android Studio's bundled JDK if version 21; otherwise install JDK 21 and select it under Gradle JDK). Node 24 works with this project. Keep the project in a short path.

Command Prompt, first checkout:

```bat
cd C:\Users\precision
 git clone https://github.com/arif202536599-cloud/arif-bioinformatics-hub.git ArifBioHub
cd ArifBioHub
npm ci
npm test
npm run android:sync
npm run android:open
```

If already cloned, use `git pull --ff-only` from the checkout instead of cloning. In Android Studio open the **android** directory, allow Gradle sync, select an emulator or USB-debugging phone, then click Run. No NCBI, OpenAI or Claude API key is required.

Build a debug APK in Command Prompt after Android Studio has configured the SDK:

```bat
cd C:\Users\precision\ArifBioHub
npm run android:sync
cd android
gradlew.bat assembleDebug
```

Output: `android\app\build\outputs\apk\debug\app-debug.apk`. Install using Android Studio or `adb install -r app-debug.apk` with the actual full APK path. Debug builds are for testing and cannot be uploaded to Play. The repository's **Android preview build** Actions workflow produces a debug APK, unsigned AAB and lint report without publishing anything to a store. Artifacts expire after 30 days.

## Signed Google Play release

1. Complete the Netlify deployment, host `public/privacy-policy.html` at a public HTTPS URL, and run `npm run android:preflight`. Its default policy URL is the configured backend's origin plus `/privacy-policy.html`.
2. Run the acceptance checks below on real Android devices. Fix failures before creating a release.
3. Confirm the app ID before your first upload; Play application IDs cannot be changed after publication. Increase versionCode for every subsequent upload in `android/app/build.gradle`.
4. Android Studio: **Build → Generate Signed App Bundle / APK → Android App Bundle**. Create an upload keystore outside the project, for example `C:\Users\precision\AndroidKeys\arif-bio-hub-upload.jks`. Keep private backups of the key, alias and passwords. Never upload these to GitHub or chat. Choose `release`. Do not use the unsigned CI AAB.
5. Register/verify your own Google Play developer account, create **Arif Bio Hub**, enrol in Play App Signing, and upload the signed `.aab` to internal testing first. Registration currently costs US$25 once. New personal accounts created after 13 November 2023 must complete a closed test with at least 12 opted-in testers for 14 consecutive days before applying for production access; Console may also require device verification.
6. The 512×512 store icon and 1024×500 feature graphic are supplied in `mobile/play-store/`. Capture actual phone screenshots from the tested release. Draft listing and data inventory are in `mobile/play-store/`. Complete the live Console's Data safety, content rating, audience, ads and app-access declarations using the tested release's actual behaviour. Verify the public privacy URL opens without sign-in. Guest-only app access requires no reviewer credentials. Review your listing and release, then submit it yourself from your developer account. Approval is Google's decision.

Official requirements: https://support.google.com/googleplay/android-developer/answer/11926878 (target API); https://support.google.com/googleplay/android-developer/answer/14151465 (testing); https://support.google.com/googleplay/android-developer/answer/6112435 (registration); https://support.google.com/googleplay/android-developer/answer/10144311 (user data).

## Phone acceptance checks (not yet performed)

- Install fresh APK on API 24+ and an Android 16/API 36 device; inspect status/navigation bars, cutouts, rotation, text scaling and keyboard overlap.
- Open every tab and Contents section. Close main drawers with Back; revisit tabs with Back and exit from Home. Check welcome dialog, local progress/notes, quizzes and storage persistence after restart.
- With airplane mode, open learning content and synthetic Central Dogma demo. Verify clear offline/network messages. Reconnect and verify status changes.
- Upload a real FASTA using the Android document picker, including multiple entries and duplicates. Verify order, validation, consent, searchable taxonomy, and server service limits. Never repeatedly resubmit an uncertain job.
- After deployment, run a known live query, wait at service intervals, inspect similar/partial candidates, select a linked reference, and inspect translation evidence. Compare with NCBI source records. Failed/missing links must be visible.
- Share a non-empty Excel report, separate FASTAs, JSON, SVG and PNG to a file app. Open each exported file outside this app. Check cancellation and failure messages. Check CSV/Markdown/HTML exports from other tools.
- Open NCBI/video links, mail and phone dial links. No direct calling or broad storage permission should be requested.
- Verify privacy page, public policy URL and consent. Test Cancel then Confirm for local clearing; saved/shared copies and remote request records must remain separate.
- Check merged-manifest permissions and lint report, review release Data safety inventory, then install/test the signed release through Play internal testing. Device behaviour remains unverified until these checks are run.
