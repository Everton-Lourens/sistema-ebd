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
    height: 85,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HEADER_BACKGROUND,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 35,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  content: {
    padding: 20,
    backgroundColor: CONTENT_BACKGROUND,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '70%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
   sendButton: {
    backgroundColor: HEADER_BACKGROUND,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeButton: {
    backgroundColor: '#ff8585ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    color: "#7d7e79",
    fontSize: 16,
    lineHeight: 30,
  },
  input2: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#e3e3e3",
    backgroundColor: "#fff",
  },
  input: {
    height: 48, // ou maior, como 52
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
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
buttonAdd: {
  position: "absolute",
  bottom: 20,
  right: 20,
  backgroundColor: "#2980b9",
  padding: 15,
  borderRadius: 15,
  zIndex: 999,
  elevation: 10,
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
    flexDirection: 'column',
    rowGap: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 22,
    marginTop: 5,
  },
  txtInput: {
    width: 350,
    margin: 5,
    backgroundColor: "white",
    color: 'gray',
    borderRadius: 20,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filters: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    left: -170,
    minHeight: 44,
    minWidth: 44,
  },
  rightButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    right: -160,
    minHeight: 44,
    minWidth: 44,
  },
  icon: {
    marginRight: 10,
  },
});
