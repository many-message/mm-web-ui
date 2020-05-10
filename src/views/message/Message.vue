<template>
  <a-layout>
    <a-layout-sider
      width="300"
      :style="{ background: '#FAFAFA', overflowY: 'scroll' }"
    >
      <a-list
        item-layout="horizontal"
        :data-source="chats"
        :style="{ width: '90%', margin: '0 auto', marginTop: '10px' }"
      >
        <a-list-item slot="renderItem" slot-scope="chat">
          <a-list-item-meta :description="chat.chatDesc">
            <router-link
              v-if="chat.chatType === '1'"
              slot="title"
              :to="'/home/message/user/' + chat.chatId"
            >
              {{ chat.chatTitle }}
            </router-link>
            <router-link
              v-else
              slot="title"
              :to="'/home/message/group/' + chat.chatId"
            >
              {{ chat.chatTitle }}
            </router-link>
            <template slot="avatar">
              <a-badge dot :count="chat.hasMsg ? 1 : 0">
                <a-avatar class="photo">{{
                  sliceName(chat.chatName)
                }}</a-avatar>
              </a-badge>
            </template>
          </a-list-item-meta>
          <a-icon
            @click="handleDeleteChat(chat.chatId)"
            class="del"
            type="close"
          />
        </a-list-item>
      </a-list>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '12px 12px', paddingRight: '24px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("chat");

export default {
  computed: {
    ...mapState(["chats"]),
  },
  methods: {
    ...mapActions(["getChats", "deleteChat"]),
    sliceName(name) {
      return sliceNickname(name);
    },
    handleDeleteChat(chatId) {
      this.deleteChat({
        chatId,
      });
    },
  },
  mounted() {
    this.getChats();
  },
};
</script>

<style scoped>
.del {
  cursor: pointer;
}
.del:hover {
  color: #1da57a;
}
.photo {
  background-color: #1da57a;
}
</style>
