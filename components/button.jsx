import { Text,Button, Touchable, TouchableOpacity } from "react-native";
export default function Buttonbutton ({label,onPress}){
    return(
        <TouchableOpacity style={{background:'brown',color:'black',padding:10}} onPress={onPress} >
            <Text>{label}</Text>
        </TouchableOpacity>
    );
}
