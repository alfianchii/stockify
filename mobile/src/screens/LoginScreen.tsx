import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useState } from "react"
import { StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, View, Platform, Text, TextInput, TouchableOpacity } from "react-native"
import { RootStackParamList } from "../navigation/AppNavigator"
import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

const COLORS = {
	primary: "#5959e8",
	backgroundDark: "#0F172A",
	inputDark: "#1b1b32",
	borderColor: "#262546",
	textMuted: "#9695c6",
	textWhite: "#FFFFFF",
	placeholder: "#58587a",
	logoFrom: "#5959e8",
	logoTo: "#3b3b98",
}

export default function LoginScreen() {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const handleLogin = () => {
		navigation.replace("Home")
	}

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<View style={[styles.blob, styles.blobTop]} />
			<View style={[styles.blob, styles.blobBottom]} />

			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<View style={styles.headerContainer}>
						<View style={styles.logoWrapper}>
							<LinearGradient colors={[COLORS.logoFrom, COLORS.logoTo]} style={styles.logoContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
								<MaterialIcons name="inventory" size={40} color={"white"} />
							</LinearGradient>
						</View>

						<View style={styles.titleContainer}>
							<Text style={styles.titleText}>Stockify</Text>
							<Text style={styles.subtitleText}>Product Management</Text>
						</View>
					</View>

					<View style={styles.formContainer}>
						{/* Email */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Email Address</Text>
							<View style={styles.inputWrapper}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="mail-outline" size={20} color={COLORS.textMuted} />
								</View>
								<TextInput
									style={styles.input}
									placeholder="alfian@gmail.com"
									placeholderTextColor={COLORS.placeholder}
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>
						</View>

						{/* Password */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Password</Text>
							<View style={styles.inputWrapper}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="lock-outline" size={20} color={COLORS.textMuted} />
								</View>
								<TextInput
									style={[styles.input, { paddingRight: 50 }]}
									placeholder="........"
									placeholderTextColor={COLORS.placeholder}
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!isPasswordVisible}
								/>
								<TouchableOpacity style={styles.eyeIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
									<MaterialIcons name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color={COLORS.textMuted} />
								</TouchableOpacity>
							</View>
							<TouchableOpacity style={styles.forgotPassword}>
								<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleLogin}>
							<Text style={styles.loginButtonText}>LOG IN</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.backgroundDark,
		alignItems: "center",
		justifyContent: "center",
	},
	blob: {
		position: "absolute",
		borderRadius: 9999,
		opacity: 0.1,
	},
	blobTop: {
		top: -height * 0.2,
		left: -width * 0.1,
		width: 500,
		height: 500,
		backgroundColor: COLORS.primary,
	},
	blobBottom: {
		bottom: -height * 0.1,
		right: -width * 0.1,
		width: 400,
		height: 400,
		backgroundColor: COLORS.primary,
	},
	keyboardView: {
		flex: 1,
		width: "100%",
		maxWidth: 400,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 24,
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: 32,
		gap: 16,
	},
	logoWrapper: {
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 20,
		elevation: 10,
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	titleContainer: {
		alignItems: "center",
		marginTop: 16,
	},
	titleText: {
		fontFamily: "Inter_700Bold",
		fontSize: 30,
		color: COLORS.textWhite,
		fontWeight: "bold",
		letterSpacing: -0.5,
	},
	subtitleText: {
		fontFamily: "Inter_500Medium",
		fontSize: 14,
		color: COLORS.textMuted,
		marginTop: 4,
		fontWeight: "500",
	},
	formContainer: {
		gap: 20,
		marginTop: 16,
	},
	inputGroup: {
		gap: 8,
	},
	label: {
		fontFamily: "Inter_500Medium",
		fontSize: 14,
		color: COLORS.textMuted,
		marginLeft: 4,
	},
	inputWrapper: {
		position: "relative",
		height: 56,
	},
	iconContainer: {
		position: "absolute",
		left: 16,
		top: 0,
		bottom: 0,
		justifyContent: "center",
		zIndex: 1,
	},
	input: {
		flex: 1,
		backgroundColor: COLORS.inputDark,
		borderColor: COLORS.borderColor,
		borderWidth: 1,
		borderRadius: 12,
		paddingLeft: 44,
		paddingRight: 16,
		color: COLORS.textWhite,
		fontSize: 16,
		fontFamily: "Inter_400Regular",
	},
	eyeIcon: {
		position: "absolute",
		right: 16,
		top: 0,
		bottom: 0,
		justifyContent: "center",
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginTop: 4,
	},
	forgotPasswordText: {
		fontFamily: "Inter_500Medium",
		fontSize: 14,
		color: COLORS.textMuted,
	},
	loginButton: {
		height: 56,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 4,
	},
	loginButtonText: {
		color: COLORS.textWhite,
		fontSize: 16,
		fontFamily: "Inter_700Bold",
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	biometricButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		gap: 12,
		borderRadius: 8,
	},
	biometricText: {
		color: COLORS.textMuted,
		fontSize: 14,
		fontFamily: "Inter_600SemiBold",
		fontWeight: "600",
	},
	footer: {
		paddingVertical: 16,
		alignItems: "center",
	},
	footerText: {
		color: COLORS.textMuted,
		fontSize: 14,
		fontFamily: "Inter_400Regular",
	},
	signupText: {
		color: COLORS.textWhite,
		fontWeight: "bold",
		fontFamily: "Inter_700Bold",
	},
})
