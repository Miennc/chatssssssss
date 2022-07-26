<template>
  <div>
    <div>
      <div class="min-h-screen bg-purple-400 flex justify-center items-center">
        <div class="absolute w-60 h-60 rounded-xl bg-purple-300 -top-5 -left-16 z-0 transform rotate-45 hidden md:block">
        </div>
        <div class="absolute w-48 h-48 rounded-xl bg-purple-300 -bottom-6 -right-10 transform rotate-12 hidden md:block">
        </div>
        <div class="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 class="text-3xl font-bold text-center mb-4 cursor-pointer">Login chat</h1>
          </div>
          <div class="space-y-4">
            <input v-model="email" type="text" placeholder="Email Addres" class="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
            <input v-model="password" type="password" placeholder="Password Addres" class="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
          </div>
          <div class="text-center mt-6">
            <button @click="submit" class="py-3 w-64 text-xl text-white bg-purple-400 rounded-2xl">Submit</button>
          </div>
        </div>
        <div class="w-40 h-40 absolute bg-purple-300 rounded-full top-0 right-12 hidden md:block"></div>
        <div
            class="w-20 h-40 absolute bg-purple-300 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "@/firebase";
import {collection, getDocs, deleteDoc, doc, onSnapshot, addDoc, query, where} from 'firebase/firestore';
import {db} from '@/firebase';
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submit() {
      if (this.email == "" || this.password == "" ) {
        alert("không được bỏ trống trường nào");
        return;
      }
      try {
        const response = await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log(response);
        this.$router.push("/chat");
        localStorage.setItem('token', JSON.stringify(response._tokenResponse.idToken));
      } catch (error) {
        console.log(error);
        alert("Không đăng nhập được là do bạn đen");
      }
    },
  },
}
</script>

<style scoped>

</style>