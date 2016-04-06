<?php

require("classes/message.php");

try {
        
        $email = new message();                
        //$email = new message("bear-wolf@ukr.net","Новая заявка с сайта 'TopSnab'", trim($_POST["fullName"]), trim($_POST["phone"]),trim($_POST['view']));                
        
        $email->to = "bear-wolf@ukr.net";
        $email->from = "Новая заявка с сайта 'MMVS - multimedia video systems'";
        $email->name = trim($_POST["fullName"]);
        $email->phone = trim($_POST["phone"]);
        $email->email = trim($_POST['email']);
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
