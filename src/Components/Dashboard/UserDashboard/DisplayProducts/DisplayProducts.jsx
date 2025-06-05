import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";

import { Cattles } from "./Cattles/Cattles";
import { Milk } from "./Milk/Milk";
import { MilkItems } from "./MilkItems/MilkItems";

const DisplayProducts = () => {
  const [cattle, setCattle] = useState([]);
  const [milk, setMilk] = useState([]);
  const [milkItems, setMilkItems] = useState([]);
  useEffect(() => {
    console.log("From useEffect");
    const fetchAllData = async () => {
      try {
        const dataDoc = collection(db, "owners");
        const animalData = await getDocs(dataDoc);
        let milkData = [];
        let cattleData = [];
        let milkProductData = [];
        animalData.docs.map((doc) => {
          let singleMilkDoc = doc.data().milk || [];
          let singleCattleDoc = doc.data().animals || [];
          let singleProductsDoc = doc.data().products || [];
          singleMilkDoc.map((item) => {
            milkData.push(item);
          });
          singleCattleDoc.map((cattle) => {
            cattleData.push(cattle);
          });
          singleProductsDoc.map((product) => {
            milkProductData.push(product);
          });

          setCattle(cattleData);
          setMilk(milkData);
          setMilkItems(milkProductData);
        });

        console.log(milkData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div>
      <>
        <Cattles cattle={cattle} />
        <Milk milk={milk} />
        <MilkItems milkItems={milkItems} />
      </>
    </div>
  );
};

export default DisplayProducts;
