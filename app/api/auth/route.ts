import { NextResponse } from "next/server";
import { hash, compare } from "bcrypt";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password, action } = body;

  if (action === "signup") {
    try {
      const hashedPassword = await hash(password, 10);

      // Check if user exists
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 },
        );
      }

      // Create new user
      const userRef = await addDoc(collection(firestore, "users"), {
        username,
        password: hashedPassword,
      });

      // Create initial list for the user
      await addDoc(collection(firestore, "lists"), {
        title: username,
        userId: userRef.id,
        points: 0,
      });

      return NextResponse.json({
        id: userRef.id,
        username,
      });
    } catch (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        { error: "Error creating user" },
        { status: 500 },
      );
    }
  }

  if (action === "login") {
    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      const passwordMatch = await compare(password, userData.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 },
        );
      }

      return NextResponse.json({
        id: userDoc.id,
        username: userData.username,
      });
    } catch (error) {
      console.error("Login error:", error);
      return NextResponse.json({ error: "Error logging in" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
