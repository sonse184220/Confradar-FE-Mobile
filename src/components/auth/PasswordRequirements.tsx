
import { View, Text, } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { PasswordRequirementsProps } from '../../types/ui/auth';

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
    password,
    confirmPassword = '',
    // showConfirmMatch = false,
}) => {
    const requirements = [
        {
            text: 'Ít nhất 8 ký tự',
            met: password.length >= 8,
        },
        {
            text: 'Chứa chữ hoa và chữ thường',
            met: /[a-z]/.test(password) && /[A-Z]/.test(password),
        },
        {
            text: 'Chứa ít nhất một số',
            met: /\d/.test(password),
        },
        {
            text: 'Chứa ít nhất một ký tự đặc biệt',
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ];

    // if (showConfirmMatch && confirmPassword) {
    //   requirements.push({
    //     text: 'Mật khẩu xác nhận khớp',
    //     met: password === confirmPassword && password.length > 0,
    //   });
    // }

    const confirmMatchMet = confirmPassword.length > 0 && password === confirmPassword;

    return (
        <View
            className="rounded-2xl p-5 mt-4 backdrop-blur-md bg-white/10 border border-[#19A7CE]/50 shadow-lg shadow-[#19A7CE]/40"
        >
            <Text
                className="text-center text-[#19A7CE] text-base font-semibold mb-3 tracking-wide drop-shadow"
            >
                🔐 Yêu cầu mật khẩu
            </Text>

            {requirements.map((req, index) => (
                <View key={index} className="flex-row items-center mb-2">
                    <Checkbox.Android
                        status={req.met ? 'checked' : 'unchecked'}
                        disabled
                        color={req.met ? '#19A7CE' : '#777'}
                        theme={{
                            colors: {
                                primary: req.met ? '#19A7CE' : '#9ca3af',
                                outline: 'transparent',
                            },
                        }}
                    />
                    <Text
                        className={`text-sm ml-1 ${req.met ? 'text-[#F6F1F1] font-semibold' : 'text-[#9ca3af]'
                            }`}
                    >
                        {req.text}
                    </Text>
                </View>
            ))}

            {confirmPassword.length > 0 && (
                <View className="flex-row items-center mt-2">
                    <Checkbox.Android
                        status={confirmMatchMet ? 'checked' : 'unchecked'}
                        disabled
                        color={confirmMatchMet ? '#19A7CE' : '#777'}
                        theme={{
                            colors: {
                                primary: confirmMatchMet ? '#19A7CE' : '#9ca3af',
                            },
                        }}
                    />
                    <Text
                        className={`text-sm ml-1 ${confirmMatchMet ? 'text-[#F6F1F1] font-semibold' : 'text-[#9ca3af]'
                            }`}
                    >
                        Mật khẩu xác nhận khớp
                    </Text>
                </View>
            )}

            <View className="mt-4 h-[1px] bg-white/20 shadow-sm shadow-[#19A7CE]/30" />
        </View>
    );

    // return (
    //     <View className="mb-6 p-4 bg-green-50 rounded-xl">
    //         <Text className="text-green-800 text-sm font-medium mb-2">
    //             📋 Yêu cầu mật khẩu:
    //         </Text>
    //         {requirements.map((req, index) => (
    //             <View key={index} className="flex-row items-center">
    //                 <Checkbox.Android
    //                     status={req.met ? 'checked' : 'unchecked'}
    //                     disabled
    //                     color="#16a34a" // màu xanh lá
    //                 />
    //                 <Text
    //                     className={`text-xs ${req.met ? 'text-green-700 font-medium' : 'text-green-600'}`}
    //                 >
    //                     {req.text}
    //                 </Text>
    //             </View>
    //         ))}

    //         {confirmPassword.length > 0 && (
    //             <View className="flex-row items-center mt-2">
    //                 <Checkbox.Android
    //                     status={confirmMatchMet ? 'checked' : 'unchecked'}
    //                     disabled
    //                     color="#16a34a"
    //                 />
    //                 <Text className={`text-xs ${confirmMatchMet ? 'text-green-700 font-medium' : 'text-green-600'}`}>
    //                     Mật khẩu xác nhận khớp
    //                 </Text>
    //             </View>
    //         )}
    //         {/* {requirements.map((req, index) => (
    //       <View key={index} className="flex-row items-center mb-1">
    //         <Text className="text-base mr-2">
    //           {req.met ? '✅' : '⭕'}
    //         </Text>
    //         <Text
    //           className={`text-xs ${req.met ? 'text-green-700 font-medium' : 'text-green-600'
    //             }`}
    //         >
    //           {req.text}
    //         </Text>
    //       </View>
    //     ))} */}
    //     </View>
    // );
};

export default PasswordRequirements;