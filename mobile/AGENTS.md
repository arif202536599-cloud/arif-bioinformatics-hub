# Arif Bio Hub Android
Use Capacitor's packaged local build. Never put a remote server.url in production config.
Run npm test, npm run check:function, npm run build and npm run android:sync.
Compile assembleDebug, bundleRelease and lintDebug with Java 21 / Android SDK 36.
Do not claim phone testing from unit tests or a successful Gradle build.
Native exports must use app-cache files and the Android chooser; no broad storage permission.
Retain search consent and server-side NCBI pacing. Follow the Central Dogma scientific contract.
Keep upload keystores/passwords outside git. Preview AABs are unsigned and cannot be published.
Do not add accounts, ads, analytics or new permissions without updating the privacy policy and Play disclosures.
Before release, run npm run android:preflight and the phone acceptance checklist in README_ANDROID.md.
