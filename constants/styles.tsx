import { StyleSheet } from "react-native";

const HEADER_BACKGROUND = "#3498db";
const CONTENT_BACKGROUND = "#f9f9f9";

const colors = {
  light: "#9e9da0",
  medium: '#86A789',
  moderate: '#739072',
  dark: '#3D3B40',
  light_bg: '#3D3B4000',
  white: '#FFFFFF',
  green: '#90EE90',
  red: '#FF7F7F'
}


export const styles = StyleSheet.create({
  topSafeArea: {
    backgroundColor: HEADER_BACKGROUND,
  },
  container: {
    flex: 1,
    backgroundColor:
      CONTENT_BACKGROUND,
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: HEADER_BACKGROUND,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
  },
  content: {
    padding: 20,
    backgroundColor: CONTENT_BACKGROUND,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    color: "#7d7e79",
    fontSize: 16,
    lineHeight: 30,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#e3e3e3",
    backgroundColor: "#fff",
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "#ff7675",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  defaultFont: {
  },
  default: {
    position: "relative",
    bottom: 30,
    backgroundColor: colors.light_bg,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoDiv: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 200,
    width: 200,
    opacity: 0.9,
  },
  welcomeDiv: {
    width: 350,
    marginBottom: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 5,
    color: colors.dark,
  },
  text: {
    fontSize: 15,
    color: "#5A5A5A",
  },
  btnDiv: {
    justifyContent: "center",
    marginTop: 40,
  },
  connectButton: {
    width: 350,
    padding: 5,
    margin: 5,
  },
  containerTxtInput: {
    width: 350,
    padding: 5,
    margin: 5,
  },
  txtInput: {
    width: 350,
    margin: 5,
    backgroundColor: "white",
  },
});
