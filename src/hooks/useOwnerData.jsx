import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config/FirebaseConfiguration";

export const useOwnerData = () => {
  const [cattle, setCattle] = useState([]);
  const [milk, setMilk] = useState([]);
  const [milkItems, setMilkItems] = useState([]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      const dataDoc = collection(db, "owners");
      const animalData = await getDocs(dataDoc);
      let milkData = [],
        cattleData = [],
        milkProductData = [];

      animalData.docs.forEach((doc) => {
        const data = doc.data();
        milkData.push(...(data.milk || []));
        cattleData.push(...(data.animals || []));
        milkProductData.push(...(data.products || []));
      });

      setCattle(cattleData);
      setMilk(milkData);
      setMilkItems(milkProductData);
    };

    fetchOwnerData();
  }, []);

  return { cattle, milk, milkItems };
};
