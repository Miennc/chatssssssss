<template>
  <div>

    <div class="container  mx-auto">
      <div class="min-w-full border rounded grid grid-cols-2">
        <div class="hidden col-span-2 lg:block">
          <div class="w-full">
            <div class="relative flex items-center p-3 border-b border-gray-300">
              <img class="object-cover w-10 h-10 rounded-full"
                   src="https://i.pinimg.com/236x/e7/89/d3/e789d312b19c04a9b29b30534f53dce2.jpg" alt="username"/>
              <span class="block ml-2 font-bold text-gray-600">Nhóm chat 1111</span>
              <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
              </span>
            </div>
            <div   class="relative w-full p-6 overflow-y-auto h-[40rem]" id="messages">
              <ul class="space-y-2">

                <li v-for="(item, index) in dataMessage" :key="index" :class="token == item.token ? `justify-end items-end` : `justify-start items-start`" class="flex flex-col w-full">
                  <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                    <span class="block">{{item.message}}</span>
                  </div>
                  <div v-if="item.image" class="w-24 h-20 rounded-md overflow-hidden">
                    <img :src="item.image" alt="" class="w-full h-full object-cover">
                  </div>
                </li>

              </ul>
            </div>

            <div class="flex items-center relative justify-between w-full p-3 border-t border-gray-300">
              <div class="absolute  -top-20 left-0 rounded-md ">
                <div v-if="url" class="w-20  relative h-20 overflow-hidden">
                  <img :src="url" alt="" class="w-full h-full object-cover">
                   <div  @click="removeImage" class="absolute -top-2 right-0 cursor-pointer text-red-500 font-bold">
                     x
                   </div>
                </div>
              </div>
              <label for="fileImg" className=" cursor-pointer mx-2">
                <i class="fa-solid fa-file text-[#065fd4]  hover:text-[#1a94ff] cursor-pointer text-xl"></i>
                <input @change="onChange" type="file" id="fileImg" accept="image/*" multiple
                       class="hidden"
                />
              </label>

              <input @keydown.enter.exact.prevent="sendMessage" v-model="messages" type="text" placeholder="Message"
                     class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                     name="message" required/>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              </button>

                <button type="submit" @click="sendMessage">
                  <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>


            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
  addDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import {db} from '@/firebase';
import {getStorage, uploadBytes, ref, getDownloadURL,storage} from "firebase/storage";
export default {
  name: "Chat",
  data() {
    return {
      messages: '',
      dataMessage: [],
      token:JSON.parse(localStorage.getItem('token')),
      files: null,
      url: '',
    }
  },
  methods: {
    onChange(e) {
      let file = e.target.files[0];
      let data = []
      var reader = new FileReader();
      reader.onloadend = async function (fileLoadedEvent) {
        let srcData = fileLoadedEvent.target.result;
         data.push(srcData)
      }
      reader.readAsDataURL(file);
      this.files = data;
      this.url =  URL.createObjectURL(file)
    },

    removeImage() {
      this.url = null
      this.files = null
    },
    async sendMessage() {
      if(this.messages== '' && this.files == null){
        alert("nhập tin nhắn hoặc chọn ảnh")
        return;
      }


        const collectionRef = collection(db, 'chats');
        await addDoc(collectionRef, {
          token:this.token,
          message: this.messages,
          date: new Date(),
          image: this.files,
        });
        this.messages = '';
        document.getElementById('messages').scrollTo(0, 1000000);
        this.files = null;
        this.url = null;
        this.messages = '';

    },
    getMessage() {
      document.getElementById('messages').scrollTo(0, 1000000);
      let unsub = null;
      const collectionRef = collection(db, "chats");
      unsub = onSnapshot(collectionRef, (snapShot) => {
        const message = [];
        snapShot.forEach((doc) => {
          message.push({
            id: doc.id,
            date: doc.data().date,
            token: doc.data().token,
            message: doc.data().message,
            image: doc.data().image,
          });
        });
        this.dataMessage = message.sort((a, b) => (a.date.seconds - b.date.seconds));
        console.log(message)
      })

    },
  },

  mounted() {
    this.getMessage();

  }
}
</script>

<style>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>