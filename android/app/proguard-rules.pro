# ============================================================================
# React Native & Hermes R8 / ProGuard Configuration Rules
# ============================================================================

# Keep React Native Bridge Methods & Annotations
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.react.bridge.ReactAttribute <methods>;
}

# Keep React Native ViewManagers & ShadowNodes instantiated via Reflection
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager {
    public <init>();
    public <fields>;
    public <methods>;
}

-keepclassmembers class * extends com.facebook.react.uimanager.ReactShadowNode {
    public <init>();
}

-keep class com.facebook.react.shell.MainReactPackage { *; }
-keep class com.facebook.react.views.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep interface com.facebook.react.bridge.JavaScriptModule { *; }
-keep interface com.facebook.react.bridge.NativeModule { *; }
-keep class com.facebook.react.bridge.NativeModule { *; }
-keep class com.facebook.react.uimanager.ViewManager { *; }
-keep class com.facebook.react.uimanager.UIImplementation { *; }
-keep class com.facebook.react.uimanager.UIManagerModule { *; }

# Preserve React Native Prop Annotations
-keep @interface com.facebook.react.uimanager.annotations.ReactProp
-keep @interface com.facebook.react.uimanager.annotations.ReactPropGroup
-keep @interface com.facebook.proguard.annotations.DoNotStrip
-keep @interface com.facebook.proguard.annotations.KeepForSdk

# Preserve class members annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

# Preserve Hermes JNI Bindings
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.instrumentation.** { *; }

# Preserve SoLoader Native Library Loading
-keep class com.facebook.soloader.** { *; }

# Suppress ProGuard build warnings for optional React Native modules
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
-dontwarn javax.annotation.**
