import { useEffect, useState, useRef } from "react";
import { subscribeFakeTime, FakeTime } from "@/config/firebaseConfig";

/**
 * Trả về Date luôn cập nhật → fake hoặc system tùy theo UseFakeTime
 */
export function useTime() {
    const [fakeTimeData, setFakeTimeData] = useState<FakeTime>({
        CustomVnTime: new Date().toISOString(),
        UseFakeTime: false,
    });

    const [now, setNow] = useState<Date>(new Date());

    const lastUpdateRef = useRef(Date.now());
    const fakeBaseRef = useRef(new Date(fakeTimeData.CustomVnTime));

    // Lắng nghe Firebase fakeTime realtime
    useEffect(() => {
        const unsubscribe = subscribeFakeTime((data) => {
            setFakeTimeData(data);
            fakeBaseRef.current = new Date(data.CustomVnTime);
            lastUpdateRef.current = Date.now();
        });

        return () => unsubscribe();
    }, []);

    // Timer update thời gian mỗi 200ms
    useEffect(() => {
        const timer = setInterval(() => {
            if (!fakeTimeData.UseFakeTime) {
                // Dùng giờ hệ thống
                setNow(new Date());
            } else {
                // Dùng fake time + delta
                const delta = Date.now() - lastUpdateRef.current;
                const computed = new Date(fakeBaseRef.current.getTime() + delta);
                setNow(computed);
            }
        }, 200); // update nhẹ, không tốn CPU

        return () => clearInterval(timer);
    }, [fakeTimeData.UseFakeTime]);

    return { now, useFakeTime: fakeTimeData.UseFakeTime };
}

// import { useEffect, useState, useRef, useCallback } from "react";
// import { subscribeFakeTime, FakeTime } from "@/config/firebaseConfig";

// /**
//  * Hook dùng để lấy giờ hiện tại, tự động fake theo Firebase nếu UseFakeTime = true
//  */
// export function useTime() {
//     const [fakeTimeData, setFakeTimeData] = useState<FakeTime>({
//         CustomVnTime: new Date().toISOString(),
//         UseFakeTime: false,
//     });

//     // Lưu thời gian local khi Firebase cập nhật để tính delta
//     const lastUpdateRef = useRef(Date.now());
//     const fakeTimeRef = useRef(new Date(fakeTimeData.CustomVnTime));

//     // Subscribe Firebase Realtime Database
//     useEffect(() => {
//         const unsubscribe = subscribeFakeTime((data) => {
//             setFakeTimeData(data);
//             fakeTimeRef.current = new Date(data.CustomVnTime);
//             lastUpdateRef.current = Date.now();
//         });

//         return () => unsubscribe();
//     }, []);

//     // Hàm trả giờ hiện tại (tự động fake time nếu UseFakeTime = true)
//     const now = useCallback(() => {
//         if (!fakeTimeData.UseFakeTime) return new Date();
//         const delta = Date.now() - lastUpdateRef.current;
//         return new Date(fakeTimeRef.current.getTime() + delta);
//     }, [fakeTimeData.UseFakeTime]);

//     return { now, useFakeTime: fakeTimeData.UseFakeTime };
// }
