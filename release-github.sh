#!/bin/sh
# 确保脚本抛出遇到的错误
set -e

# git add -A
# git commit -m 'deploy'
# git push origin master

# # 进入生成的文件夹
# cd ./blog

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git push -u -f git@github.com:Jameel01/yjm.github.io.git master

cd -