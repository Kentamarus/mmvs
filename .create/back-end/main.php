<?php

require("classes/message.php");

try {
        
        $email = new message();                
        //$email = new message("bear-wolf@ukr.net","Новая заявка с сайта 'TopSnab'", trim($_POST["fullName"]), trim($_POST["phone"]),trim($_POST['view']));                
        
        $email->to = "bear-wolf@ukr.net";
        $email->from = "Новая заявка с сайта 'TopSnab'";
        $email->name = trim($_POST["fullName"]);
        $email->phone = trim($_POST["phone"]);
        $email->description = trim($_POST['view']);
        $email->theme = "Content-type: text/plain; charset=\"utf-8\"\n From: $email->from";
    
        if ($email->send()>0)
        {
            echo "Сообщение отправилось успешно";            
        }
    
}
catch (Exception $e)
{
    echo "Exception=".$e;
}
?>
